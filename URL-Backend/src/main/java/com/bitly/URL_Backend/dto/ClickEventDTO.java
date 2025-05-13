package com.bitly.URL_Backend.dto;

import lombok.AllArgsConstructor;

import java.time.LocalDate;

@AllArgsConstructor
public class ClickEventDTO {
    private long count;
    private LocalDate clickedDate;

    public ClickEventDTO(LocalDate clickedDate, long count) {
        this.clickedDate = clickedDate;
        this.count = count;
    }

    public LocalDate getClickedDate() {
        return clickedDate;
    }

    public ClickEventDTO setClickedDate(LocalDate clickedDate) {
        this.clickedDate = clickedDate;
        return this;
    }

    public long getCount() {
        return count;
    }

    public ClickEventDTO setCount(int count) {
        this.count = count;
        return this;
    }
}