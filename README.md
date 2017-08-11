Full-stack Node.js / ReactJS app.

Purpose of app is to scrape several websites using cheerio to collect stats on baseball players.  These stats are used to calculate BPO+ which is inspired by this website and accompanying book: http://www.bestworstbaseball.com/statistics.html

To run Redux version, use build.sh in /scripts

App makes use of several new technologies for me:
- DynamoDB (used local for development before pushing to web service)
- ReactJS (for front-end)
- AWS Lambda with AWS API Gateway
- CI/CD pipeline with AWS CodePipeline
- Addition of Google Analytics tracking
- Implementation of Redux architecture with Thunk middleware in ReactJS front-end

Later versions will include:
- AWS IAM Authentication

Thanks for checking out my project!!
