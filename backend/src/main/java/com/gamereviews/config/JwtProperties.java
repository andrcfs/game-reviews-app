package com.gamereviews.config;

import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;

import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;

@Component
@ConfigurationProperties(prefix = "jwt")
public class JwtProperties {

    private String secret;
    private long expiration = 86400000; // 24 hours default

    public String getSecret() {
        if (secret == null || secret.length() < 32) {
            // Generate a secure key if none provided or too short
            secret = java.util.Base64.getEncoder().encodeToString(
                    Keys.secretKeyFor(SignatureAlgorithm.HS512).getEncoded());
        }
        return secret;
    }

    public void setSecret(String secret) {
        this.secret = secret;
    }

    public long getExpiration() {
        return expiration;
    }

    public void setExpiration(long expiration) {
        this.expiration = expiration;
    }
}
