package com.example.prep_pilot.exception;

public class NullNicknameException extends RuntimeException {

    public NullNicknameException(){

        super("닉네임을 입력해주세요.");
    }
}
