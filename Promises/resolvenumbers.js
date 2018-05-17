const addNumbers = (num1, num2, )=>{
    return new Promise((resolve, reject)=>{
        if (Number.isInteger(num1) && Number.isInteger(num2)) {
            var answer = num1 + num2;
            return answer;
        }
        else {
      console.log('Not a number');
  };
})};

addNumbers('five', 2)
    .then(answer=>{
        console.log(answer);
    })
    .catch(error=>{
            console.log(error);
        });