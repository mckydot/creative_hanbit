package org.example.fgback.userManager;

import lombok.AllArgsConstructor;
import lombok.Data;
import java.util.*;
@Data
@AllArgsConstructor
public class userDTO {
    private String email;
    private String username;
    private List<String> keywords;
}
