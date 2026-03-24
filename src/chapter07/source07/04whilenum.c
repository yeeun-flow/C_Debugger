#define _CRT_SECURE_NO_WARNINGS
#include <stdio.h>

int main()
{
    double number = 1, sum = 0;

    while (number != 0.0)
    {
        printf("실수 입력 >> ");
        scanf("%lf", &number);
        sum += number;
    }

    printf("합 = %.2f\n", sum);

    return 0;
}
