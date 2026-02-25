package com.actforgood.matching.exception;

public class ResourceNotFoundException extends RuntimeException {
    private String resourceName;
    private String resourceId;

    public ResourceNotFoundException(String resourceName, String resourceId) {
        super(String.format("%s not found with id: %s", resourceName, resourceId));
        this.resourceName = resourceName;
        this.resourceId = resourceId;
    }

    public ResourceNotFoundException(String message) {
        super(message);
    }

    public String getResourceName() {
        return resourceName;
    }

    public String getResourceId() {
        return resourceId;
    }
}
