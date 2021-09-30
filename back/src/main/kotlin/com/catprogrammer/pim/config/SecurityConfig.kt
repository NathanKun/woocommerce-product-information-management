package com.catprogrammer.pim.config

import org.springframework.beans.factory.annotation.Qualifier
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder
import org.springframework.security.config.annotation.method.configuration.EnableGlobalMethodSecurity
import org.springframework.security.config.annotation.web.builders.HttpSecurity
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter
import org.springframework.security.core.userdetails.UserDetailsService
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder
import org.springframework.web.cors.CorsConfiguration
import org.springframework.web.cors.CorsConfigurationSource
import org.springframework.web.cors.UrlBasedCorsConfigurationSource

@Configuration
@EnableWebSecurity
@EnableGlobalMethodSecurity(prePostEnabled = true)
class SecurityConfig(
    @Qualifier("userDetailService") private val userDetailsService: UserDetailsService,
    private val bCryptPasswordEncoder: BCryptPasswordEncoder,
) : WebSecurityConfigurerAdapter() {

    @Bean
    fun corsConfigurationSource(): CorsConfigurationSource {
        val configuration = CorsConfiguration()
        configuration.allowedOrigins = listOf("http://127.0.0.1:4200", "http://localhost:4200", "https://pim.viecasa.com")
        configuration.allowedMethods = listOf("GET", "POST", "PUT", "DELETE", "OPTIONS")
        configuration.allowedHeaders = listOf("*")
        configuration.allowCredentials = true
        val source = UrlBasedCorsConfigurationSource()
        source.registerCorsConfiguration("/**", configuration)
        return source
    }

    @Throws(Exception::class)
    override fun configure(auth: AuthenticationManagerBuilder) {
        auth.userDetailsService(userDetailsService).passwordEncoder(bCryptPasswordEncoder)
    }

    @Throws(Exception::class)
    override fun configure(http: HttpSecurity) {
        http.cors().and()
            .formLogin()
            .loginPage("/login")
            .defaultSuccessUrl("/pim/index.html", true)
            .and()
            .logout()
            .logoutUrl("/logout")
            .and()
            .authorizeRequests()
            .antMatchers("/authentication/require", "/login", "/pim/manifest.webmanifest").permitAll()
            .antMatchers("/api/**").access("hasAuthority('ADMIN') or hasIpAddress('127.0.0.1/32') or hasIpAddress('0:0:0:0:0:0:0:1')")
            .anyRequest().authenticated()
            .and().csrf().disable()
            .rememberMe()
            .tokenValiditySeconds(36000) // 过期时间，单位为秒
            .userDetailsService(userDetailsService) // 处理自动登录逻辑
    }
}
