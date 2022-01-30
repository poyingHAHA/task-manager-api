const { calculateTip, fahrenheitToCelsius, celsiusToFahrenheit, add } = require('../src/math')

test('Should calculate total with tip', () => {
    const total = calculateTip(10, 0.3)
    expect(total).toBe(13)

    // if(total !== 13){
    //     throw new Error('Total tip should be 13. Got ' + total)
    // }
})

// test('Should calculate total with default tip', () => {
//     const total = calculateTip(10)
//     expect(total).toBe(12.5)
// })

// test('Should convert 32F to 0c', () => {
//     const result = fahrenheitToCelsius(32);
//     expect(result).toBe(0)
// })

// test('should convert 0 to 32', () => {
//     const result = celsiusToFahrenheit(0);
//     expect(result).toBe(32)
// })

// // Testing asynchronus function
// // test('Async test demo', (done) => { // It's your job to call done after everything is complte.
// //     setTimeout(() => {
// //         expect(1).toBe(3)
// //         done()
// //     }, 2000)
// // })

// test('Should add two numbers', (done) => {
//     add(2, 3).then((sum) => {
//         expect(sum).toBe(5)
//         done()
//     })
// })

// test('Should add two numbers async/await', async() => { //It's more common to use async/await because of the benefits of the same syntax.
//     const sum = await add(10, 22)
//     expect(sum).toBe(32)
// })

// // test("Hello world!", () => {
// //   // The string is the name for our test case.  
// //   // When we register a test, we call the test function providing a namw and the function when jest runs our tests, it simply runs that function.

// // });

// // test('THis should fail', () => {
// //     throw new Error('Failure!')
// // })

// //
// // Why test?
// //
// // - Saves time
// // - Creats reliable software
// // - Gives flexibility to developers
// //   - Refactoring
// //   - Collaborating
// //   - Profiling
// // - Peace of mind
// //
// // Image if I want to make sure tha task manager was completly functional, I would have to go over to postman.
// // I'd have to fire off a bunch of different requests, changing things to make sure I got the correct errors when bad data was provided.
// // It would be a slow process and there would be a lot of room for human error.
// // When we have a cod based test cas, we can rerun our entire test suite by typing out six characters.