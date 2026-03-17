#define _CRT_SECURE_NO_WARNINGS
#include <stdio.h>

int main(void)
{
    int n;
    printf("정수 입력: ");
    scanf("%d", &n);

    if (n % 2)          // n % 2 != 0 이면 홀수
    {
        printf("홀수\n");
    }                   // ✓ } 뒤 세미콜론 제거
    else
    {
        printf("짝수\n");
    }

    // 조건연산자로 한 줄로 표현
    (n % 2) ? printf("홀수\n") : printf("짝수\n");

    return 0;
}
