package org.example.fgback.SearchSet;

import jakarta.annotation.PostConstruct;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.core.io.ClassPathResource;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.nio.charset.StandardCharsets;
import java.util.Collections;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;
import java.util.*;
import org.example.fgback.SearchSet.hangulUtil;
import lombok.Value;
public class DictionaryService {
    private static final Logger logger = LoggerFactory.getLogger(DictionaryService.class);


    private final Set<String> originalDictionary = new HashSet<>();

    private final Map<String, String> decomposedMap = new HashMap<>();

    @PostConstruct
    public void init() {
        ClassPathResource resource = new ClassPathResource("dictionary.txt");
        try (BufferedReader reader = new BufferedReader(
                new InputStreamReader(resource.getInputStream(), StandardCharsets.UTF_8))) {

            String line;
            while ((line = reader.readLine()) != null) {
                if (!line.trim().isEmpty()) {
                    String originalWord = line.trim().toLowerCase();
                    String decomposedWord = hangulUtil.decompose(originalWord);

                    originalDictionary.add(originalWord);
                    decomposedMap.put(decomposedWord, originalWord);
                }
            }
            logger.info("사전 로드 완료. (원본: {}, 분해: {})", originalDictionary.size(), decomposedMap.size());

        } catch (IOException e) {
            logger.error("사전 파일(dictionary.txt)을 읽는 중 오류 발생", e);
        }
    }

    public List<String> getSuggestions(String inputWord, int maxDistance) {
        String lowerInput = inputWord.toLowerCase();
        if (originalDictionary.contains(lowerInput)) {
            return Collections.emptyList();
        }
        String decomposedInput = hangulUtil.decompose(lowerInput);
        return decomposedMap.keySet().stream()
                .map(decomposedDictWord -> {
                    int distance = LevenshteinDistance.calculate(decomposedInput, decomposedDictWord);
                    return new WordSuggestion(decomposedDictWord, distance);
                })
                .filter(suggestion -> suggestion.getDistance() > 0 && suggestion.getDistance() <= maxDistance)
                .sorted()
                .map(suggestion ->
                        decomposedMap.get(suggestion.getDecomposedWord())
                )
                .distinct()
                .collect(Collectors.toList());
    }
    @Value
    private static class WordSuggestion implements Comparable<WordSuggestion> {
        String decomposedWord;
        int distance;

        @Override
        public int compareTo(WordSuggestion other) {
            return Integer.compare(this.distance, other.distance);
        }
    }
}
