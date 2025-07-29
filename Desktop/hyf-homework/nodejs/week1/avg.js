const args = process.argv.slice(2); 

if (args.length === 0) {
  console.log("Please provide numbers as command line arguments (e.g., node avg.js 1 2 3)");
} else {
  let sum = 0;
  let count = 0;
  const invalidArgs = [];

  for (const arg of args) {
    const num = parseFloat(arg); 

    if (!isNaN(num)) { 
      sum += num;
      count++;
    } else {
      invalidArgs.push(arg);
    }
  }

  if (count === 0) {
    console.log("No valid numbers were provided to calculate the average.");
    if (invalidArgs.length > 0) {
      console.log(`Invalid arguments ignored: ${invalidArgs.join(', ')}`);
    }
  } else {
    const average = sum / count;
    console.log(average);
    if (invalidArgs.length > 0) {
      console.log(`Note: The following arguments were ignored as they are not numbers: ${invalidArgs.join(', ')}`);
    }
  }
}

