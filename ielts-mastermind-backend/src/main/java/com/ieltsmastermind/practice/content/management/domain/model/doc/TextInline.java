package com.ieltsmastermind.practice.content.management.domain.model.doc;

import com.fasterxml.jackson.annotation.JsonProperty;

import java.util.Objects;

/** { type: "text"; style?; color?; size?; value } */
public record TextInline(String value, String style, String color, Integer size) implements InlineNode {
    public TextInline {
        Objects.requireNonNull(value, "value");
    }

    @JsonProperty("type")
    public String type() {
        return "text";
    }
}