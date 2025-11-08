# Polanji Performance Testing (k6) By Rumana

This project contains performance test scripts for the **Polanji Learning Platform**, implemented using **k6** and visualized using **Grafana + InfluxDB**.

The goal of this work was to:
- Perform **Load**, **Stress**, **Spike**, and **Soak** testing
- Test **individual APIs** as well as **full course workflow**
- Generate **performance metrics dashboards** for monitoring and comparison
- Ensure the framework is **scalable, modular, and easy to extend**

---



*****Project Structure:*******


polanji-ptest/
│
├── tests/
│ ├── login.js
│ ├── topics-test.js
│ ├── courses-test.js
│ ├── enroll-test.js
│ ├── update-progress-test.js
│ ├── quiz-complete-test.js
│ ├── full-workflow-test.js
│ └── utils/
│ └── config.js
│
└── README.md





---

*****Environment Variables (Required)******

Create a `.env` file **in the project root**:

```env
BASE_URL=https://api.polanji.com
USERNAME=performancetest02@gmail.com
PASSWORD=user123456



These are accessed in scripts via:


__ENV.BASE_URL
__ENV.USERNAME
__ENV.PASSWORD






Running Tests



	Run Login Test:

	k6 run \
  		-e BASE_URL=$BASE_URL \
  		-e USERNAME=$USERNAME \
  		-e PASSWORD=$PASSWORD \
  		tests/login.js


	Run Full Workflow Test (Login > Enroll > Progress > Quiz):
	
	k6 run \
  		-e BASE_URL=$BASE_URL \
 		-e USERNAME=$USERNAME \
  		-e PASSWORD=$PASSWORD \
  		tests/full-workflow-test.js


Store Test Results in InfluxDB (For Grafana):

	Run k6 with output streaming:

	k6 run \
  		-e BASE_URL=$BASE_URL \
  		-e USERNAME=$USERNAME \
  		-e PASSWORD=$PASSWORD \
  		--out influxdb=http://localhost:8086/k6 \
  		tests/full-workflow-test.js


InfluxDB Setup

	Start InfluxDB
	
	Check if running:

		lsof -i :8086


	Connect:
		
		influx

	Select DB:

		USE k6;

Grafana Setup

	1. Open Grafana
		
		http://localhost:3000

	2. Login

		User: admin
		Pass: 199000

	3. Go to: Configuration → Data Sources → Add Data Source

	4. Select: InfluxDB

	5. Set:

		URL: http://localhost:8086
		Database: k6
		Query Language: InfluxQL

	6. Save & Test > Success


Dashboards

	Import k6 Performance Dashboard

		Go to: Grafana > Dashboards > Import

	Paste dashboard ID:

		2587


Performance Testing Types Implemented

	Load Test > Done [5-20 users continuous Load]
	Stress Test > [Gradual high load to Failure]
	Spike Test > Done [Sudden Large traffic Jump]
	Soak Test > Done [Long-duration steady usage]

Endpoints Covered

	/log_in [login.js]
	/topics [topics-test.js]
	/courses [courses-test.js]
	/enroll [enroll-test.js]
	/courses/update_progress [update-progress-test.js]
	/courses/{id}/sections/{n}/quiz-complete [quiz-complete-test.js]



Full Workflow Automation Includes:

	1. Login and get token

	2. Fetch courses

	3. Enroll user

	4. Update progress multiple times

	5. Complete quiz





Author

Rumana
Performance Test Engineer
GitHub: https://github.com/rumanaislamjui-PTE

