package com.example.demo.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "keyword_info")
public class Keyword {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer kid;

    private String keyword;
    
    // Getters and Setters
    public void setId(Integer id) {
    	this.kid = id;
    }
    
    public Integer getId() {
    	return kid;
    }
    
    public void setKeyword(String keyword) {
    	this.keyword = keyword;
    }
    
    public String getKeyword() {
    	return keyword;
    }
}

