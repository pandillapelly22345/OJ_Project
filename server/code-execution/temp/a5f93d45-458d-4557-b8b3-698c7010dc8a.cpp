#include <iostream> // Required for input/output operations

int main() {
    int num1, num2;
    std::cin >> num1;
    std::cin >> num2;

    int sum = num1 + num2;

    std::cout << "The sum of " << num1 << " and " << num2 << " is: " << sum << std::endl;

    return 0; // Indicate successful program execution
}