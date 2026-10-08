import { useState, useEffect, useMemo, useCallback } from "react";
import {
  EconomicIndicator,
  EconomyCategory,
  OfficialAgency,
} from "../types/economy";
import {
  fetchEconomicIndicators,
  filterEconomicIndicators,
  normalizeEconomicIndicator,
} from "../services/economyService";
import { OFFICIAL_ECONOMIC_INDICATORS } from "../data/economyData";

interface UseEconomyOptions {
  initialIndicators?: EconomicIndicator[];
}

export function useEconomy(options?: UseEconomyOptions) {
  const [indicators, setIndicators] = useState<EconomicIndicator[]>(() => {
    const list =
      options?.initialIndicators && options.initialIndicators.length > 0
        ? options.initialIndicators
        : OFFICIAL_ECONOMIC_INDICATORS;
    return list.map(normalizeEconomicIndicator);
  });

  const [loading, setLoading] = useState<boolean>(false);
  const [selectedCategory, setSelectedCategory] = useState<EconomyCategory | "Todas">("Todas");
  const [selectedSource, setSelectedSource] = useState<OfficialAgency | "Todas">("Todas");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [activeIndicatorModal, setActiveIndicatorModal] = useState<EconomicIndicator | null>(null);

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const data = await fetchEconomicIndicators();
      if (data && data.length > 0) {
        setIndicators(data);
      }
    } catch {
      // Falha tratada no serviço com fallback local
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const filteredIndicators = useMemo(() => {
    return filterEconomicIndicators(indicators, {
      category: selectedCategory,
      source: selectedSource,
      searchQuery,
    });
  }, [indicators, selectedCategory, selectedSource, searchQuery]);

  const stats = useMemo(() => {
    const total = indicators.length;
    const ibgeCount = indicators.filter((i) => i.source === "IBGE").length;
    const bcbCount = indicators.filter((i) => i.source === "Banco Central do Brasil").length;
    return { total, ibgeCount, bcbCount };
  }, [indicators]);

  return {
    indicators,
    filteredIndicators,
    loading,
    selectedCategory,
    setSelectedCategory,
    selectedSource,
    setSelectedSource,
    searchQuery,
    setSearchQuery,
    activeIndicatorModal,
    setActiveIndicatorModal,
    refreshData: loadData,
    stats,
  };
}
