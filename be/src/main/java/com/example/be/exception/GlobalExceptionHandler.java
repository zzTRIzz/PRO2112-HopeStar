package com.example.be.exception;

import jakarta.validation.ConstraintDeclarationException;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.context.request.WebRequest;

import java.time.LocalDateTime;

@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler({Exception.class})
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    public ErrorResponse handleInternalException(Exception e, WebRequest request){
        ErrorResponse errorResponse = new ErrorResponse() ;
        errorResponse.setTimestamp(LocalDateTime.now());
        errorResponse.setStatus(HttpStatus.BAD_REQUEST.value());
        errorResponse.setPath(request.getDescription(false).replace("uri=", ""));
        errorResponse.setError(HttpStatus.BAD_REQUEST.getReasonPhrase());

        String message = e.getMessage();

        if(e instanceof MethodArgumentNotValidException){
            int start = message.lastIndexOf("[");
            int end = message.lastIndexOf("]");
            message = message.substring(start + 1, end - 1);
            errorResponse.setMessage(message);
        }else if (e instanceof ConstraintDeclarationException){
            message = message.substring(message.indexOf(":") + 1);
            errorResponse.setError("Parameter invalid");
        }
        errorResponse.setMessage(message);

        System.out.println("=========================> handleException: " + e.getMessage());
        return errorResponse;
    }
}
