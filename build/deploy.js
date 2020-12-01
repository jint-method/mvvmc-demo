  
const ghPages = require('gh-pages');

ghPages.publish('public', {
    user: {
        name: "jint-method",
        email: "codingwithkyle@gmail.com",
    },
    repo: 'https://' + process.env.ACCESS_TOKEN +'@github.com/jint-method/mvvmc-example.git',
    silent: true
}, (error)=>{
    if (error)
    {
        console.log(error);
    }
});