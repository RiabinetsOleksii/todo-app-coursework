package com.example.todoapp.dto;

public class SubtaskRequest {
    private String title;
    // Оскільки підзадачі створюються як не виконані
    // private boolean completed = false;

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }
}