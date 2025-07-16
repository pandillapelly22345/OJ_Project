#include <iostream> // Required for input/output operations

int main() {
    int num1, num2, sum; // Declare integer variables
    std::cin >> num1; // Read the first number
    std::cin >> num2; // Read the second number

    sum = num1 + num2; // Calculate the sum

    // Display the sum
    std::cout << "The sum of " << num1 << " and " << num2 << " is: " << sum << std::endl;

    return 0; // Indicate successful execution
}