package com.dishaspora.common.util;

import java.util.Map;

public final class CountryUtil {
    private CountryUtil() {}

    private static final Map<String, String> NAMES = Map.ofEntries(
            Map.entry("GH", "Ghana"),
            Map.entry("NG", "Nigeria"),
            Map.entry("ITALY", "Italy"),
            Map.entry("USA", "United States"),
            Map.entry("LEBANON", "Lebanon"),
            Map.entry("UK", "United Kingdom"),
            Map.entry("CHINA", "China"),
            Map.entry("FRANCE", "France"),
            Map.entry("MEXICO", "Mexico"),
            Map.entry("INDIA", "India"),
            Map.entry("SAUDI ARABIA", "Saudi Arabia"),
            Map.entry("GREECE", "Greece"),
            Map.entry("SPAIN", "Spain"),
            Map.entry("JAPAN", "Japan"),
            Map.entry("THAILAND", "Thailand"),
            Map.entry("SOUTH KOREA", "South Korea")
    );

    private static final Map<String, String> FLAGS = Map.ofEntries(
            Map.entry("GH", "🇬🇭"),
            Map.entry("NG", "🇳🇬"),
            Map.entry("ITALY", "🇮🇹"),
            Map.entry("USA", "🇺🇸"),
            Map.entry("LEBANON", "🇱🇧"),
            Map.entry("UK", "🇬🇧"),
            Map.entry("CHINA", "🇨🇳"),
            Map.entry("FRANCE", "🇫🇷"),
            Map.entry("MEXICO", "🇲🇽"),
            Map.entry("INDIA", "🇮🇳"),
            Map.entry("SAUDI ARABIA", "🇸🇦"),
            Map.entry("GREECE", "🇬🇷"),
            Map.entry("SPAIN", "🇪🇸"),
            Map.entry("JAPAN", "🇯🇵"),
            Map.entry("THAILAND", "🇹🇭"),
            Map.entry("SOUTH KOREA", "🇰🇷")
    );

    public static String countryName(String code) {
        if (code == null) return "Unknown";
        return NAMES.getOrDefault(code.toUpperCase(), code);
    }

    public static String flagEmoji(String code) {
        if (code == null) return "🌍";
        return FLAGS.getOrDefault(code.toUpperCase(), "🌍");
    }

    public static String currencyFor(String country) {
        return "NG".equalsIgnoreCase(country) ? "NGN" : "GHS";
    }
}
