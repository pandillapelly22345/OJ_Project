#include <iostream>

int main() {
    int number1, number2, sum;

    std::cin >> number1;
    std::cin >> number2;
    sum = number1 + number2;

    std::cout << "The sum of " << number1 << " and " << number2 << " is: " << sum << std::endl;

    return 0;
}