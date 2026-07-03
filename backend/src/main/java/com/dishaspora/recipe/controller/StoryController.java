package com.dishaspora.recipe.controller;

import com.dishaspora.common.dto.PageDto;
import com.dishaspora.recipe.dto.StoryDto;
import com.dishaspora.recipe.service.StoryService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api")
public class StoryController {

    private final StoryService storyService;

    public StoryController(StoryService storyService) {
        this.storyService = storyService;
    }

    @GetMapping("/stories")
    public PageDto<StoryDto> stories(@RequestParam(required = false) String country,
                                     @RequestParam(defaultValue = "0") int page) {
        return storyService.stories(country, page);
    }
}
