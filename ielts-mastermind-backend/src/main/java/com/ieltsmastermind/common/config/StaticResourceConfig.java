package com.ieltsmastermind.common.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class StaticResourceConfig implements WebMvcConfigurer {

//    <img src={practiceContent.thumbnailUrl} />
//    <audio controls src={practiceContent.audioUrl} />
    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        registry.addResourceHandler("/files/thumbnails/**")
                .addResourceLocations("file:uploads/thumbnails/");

        registry.addResourceHandler("/files/audio/**")
                .addResourceLocations("file:uploads/audio/");
    }
}
