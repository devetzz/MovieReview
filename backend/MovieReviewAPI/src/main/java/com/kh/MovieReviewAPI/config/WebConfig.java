package com.kh.MovieReviewAPI.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig implements WebMvcConfigurer{

	@Override
	public void addCorsMappings(CorsRegistry registry) {
		registry.addMapping("/**")	// 애플리케이션의 모든 엔드포인트에 CORS 설정을 적용
				.allowedOrigins("http://localhost:5173")	// 프론트엔드 개발 서버의 주소를 허용
				.allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")	// 허용할 HTTP 메소드 지정
				.allowedHeaders("*")	// 모든 헤더 허용
				.allowCredentials(true);	// 자격증명(쿠키 등)을 허용
	}
}
