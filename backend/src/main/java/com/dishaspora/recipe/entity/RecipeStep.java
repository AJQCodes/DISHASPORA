package com.dishaspora.recipe.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;

@Embeddable
public class RecipeStep {

    @Column(name = "step_number")
    private int stepNumber;

    @Column(name = "step_instruction", length = 2000)
    private String instruction;

    @Column(name = "step_duration_minutes")
    private Integer durationMinutes;

    @Column(name = "step_image_url")
    private String imageUrl;

    public RecipeStep() {}

    public RecipeStep(int stepNumber, String instruction, Integer durationMinutes, String imageUrl) {
        this.stepNumber = stepNumber;
        this.instruction = instruction;
        this.durationMinutes = durationMinutes;
        this.imageUrl = imageUrl;
    }

    public int getStepNumber() { return stepNumber; }
    public void setStepNumber(int stepNumber) { this.stepNumber = stepNumber; }
    public String getInstruction() { return instruction; }
    public void setInstruction(String instruction) { this.instruction = instruction; }
    public Integer getDurationMinutes() { return durationMinutes; }
    public void setDurationMinutes(Integer durationMinutes) { this.durationMinutes = durationMinutes; }
    public String getImageUrl() { return imageUrl; }
    public void setImageUrl(String imageUrl) { this.imageUrl = imageUrl; }
}
