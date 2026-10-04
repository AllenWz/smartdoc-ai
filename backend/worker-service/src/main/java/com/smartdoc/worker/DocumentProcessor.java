package com.smartdoc.worker;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;

@Component
public class DocumentProcessor {
    private static final Logger log = LoggerFactory.getLogger(DocumentProcessor.class);

    public void process(String documentId) {
        // TODO: fetch the document, extract text, and invoke the configured Bedrock/SageMaker workflow.
        log.info("Received document {} for processing", documentId);
    }
}
