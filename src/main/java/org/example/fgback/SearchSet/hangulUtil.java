package org.example.fgback.SearchSet;

public class hangulUtil {
    private static final char[] CHOSUNG = {
            'ㄱ', 'ㄲ', 'ㄴ', 'ㄷ', 'ㄸ', 'ㄹ', 'ㅁ', 'ㅂ', 'ㅃ', 'ㅅ', 'ㅆ',
            'ㅇ', 'ㅈ', 'ㅉ', 'ㅊ', 'ㅋ', 'ㅌ', 'ㅍ', 'ㅎ'
    };
    // 중성 리스트
    private static final char[] JUNGSUNG = {
            'ㅏ', 'ㅐ', 'ㅑ', 'ㅒ', 'ㅓ', 'ㅔ', 'ㅕ', 'ㅖ', 'ㅗ', 'ㅘ', 'ㅙ',
            'ㅚ', 'ㅛ', 'ㅜ', 'ㅝ', 'ㅞ', 'ㅟ', 'ㅠ', 'ㅡ', 'ㅢ', 'ㅣ'
    };
    // 종성 리스트 (0번째는 종성 없음)
    private static final char[] JONGSUNG = {
            '\0', 'ㄱ', 'ㄲ', 'ㄳ', 'ㄴ', 'ㄵ', 'ㄶ', 'ㄷ', 'ㄹ', 'ㄺ', 'ㄻ',
            'ㄼ', 'ㄽ', 'ㄾ', 'ㄿ', 'ㅀ', 'ㅁ', 'ㅂ', 'ㅄ', 'ㅅ', 'ㅆ', 'ㅇ',
            'ㅈ', 'ㅊ', 'ㅋ', 'ㅌ', 'ㅍ', 'ㅎ'
    };

    public static String decompose(String s) {
        if (s == null) {
            return "";
        }

        StringBuilder sb = new StringBuilder();
        for (char c : s.toCharArray()) {
            if (c >= 0xAC00 && c <= 0xD7A3) {
                int base = c - 0xAC00;

                // 1. 초성
                int choseongIndex = base / (21 * 28);
                sb.append(CHOSUNG[choseongIndex]);

                // 2. 중성
                int jungsungIndex = (base % (21 * 28)) / 28;
                sb.append(JUNGSUNG[jungsungIndex]);

                // 3. 종성
                int jongseongIndex = base % 28;
                if (jongseongIndex > 0) {
                    sb.append(JONGSUNG[jongseongIndex]);
                }
            } else {
                sb.append(c);
            }
        }
        return sb.toString();
    }
}
