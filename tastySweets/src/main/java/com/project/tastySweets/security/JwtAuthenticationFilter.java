package com.project.tastySweets.security;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.util.StringUtils;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.Collection;

public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private final JwtTokenProvider tokenProvider;
    private final UserDetailsService customUserDetailsService;

    public JwtAuthenticationFilter(JwtTokenProvider tokenProvider, UserDetailsService customUserDetailsService) {
        this.tokenProvider = tokenProvider;
        this.customUserDetailsService = customUserDetailsService;
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {

        System.out.println("🔍 JWT Filter - Request: " + request.getMethod() + " " + request.getRequestURI());

        String jwt = getJwtFromRequest(request);
        System.out.println("🔍 JWT Token exists: " + (jwt != null));

        if (StringUtils.hasText(jwt)) {
            boolean isValid = tokenProvider.validateToken(jwt);
            System.out.println("🔍 JWT Token valid: " + isValid);

            if (isValid) {
                String username = tokenProvider.getUsernameFromJWT(jwt);
                System.out.println("🔍 Username from JWT: " + username);

                // ✅ FIXED: Changed getRolesFromJWT to getAuthoritiesFromJWT
                Collection<? extends GrantedAuthority> authorities = tokenProvider.getAuthoritiesFromJWT(jwt);
                System.out.println("🔍 Authorities from JWT: " + authorities);

                // Create authentication with JWT authorities
                UsernamePasswordAuthenticationToken authentication =
                        new UsernamePasswordAuthenticationToken(username, null, authorities);
                authentication.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));

                SecurityContextHolder.getContext().setAuthentication(authentication);
                System.out.println("✅ Authentication set in SecurityContext with authorities: " + authorities);
            }
        } else {
            System.out.println("⚠️  No JWT token found in request");
        }

        filterChain.doFilter(request, response);
    }

    private String getJwtFromRequest(HttpServletRequest request) {
        String bearerToken = request.getHeader("Authorization");
        System.out.println("🔍 Authorization header: " + (bearerToken != null ? "Bearer ..." : "null"));

        if (StringUtils.hasText(bearerToken) && bearerToken.startsWith("Bearer ")) {
            return bearerToken.substring(7);
        }
        return null;
    }
}