@echo off
REM ============================================================
REM  EduPathway India — Deploy Script (Windows Batch)
REM  Usage: deploy.bat
REM  SCPs changed source files to VM then triggers remote rebuild
REM ============================================================

set VM=root@10.127.248.85
set REMOTE=/opt/edu-guide/frontend
set LOCAL=%~dp0frontend

echo [1/2] Copying source files to VM...

scp "%LOCAL%\src\App.jsx"                          %VM%:%REMOTE%/src/App.jsx
scp "%LOCAL%\src\components\Layout.jsx"            %VM%:%REMOTE%/src/components/Layout.jsx
scp "%LOCAL%\src\styles\global.css"                %VM%:%REMOTE%/src/styles/global.css
scp "%LOCAL%\src\pages\Home.jsx"                   %VM%:%REMOTE%/src/pages/Home.jsx
scp "%LOCAL%\src\pages\Colleges.jsx"               %VM%:%REMOTE%/src/pages/Colleges.jsx
scp "%LOCAL%\src\pages\EntranceExams.jsx"          %VM%:%REMOTE%/src/pages/EntranceExams.jsx
scp "%LOCAL%\src\pages\CareerPaths.jsx"            %VM%:%REMOTE%/src/pages/CareerPaths.jsx
scp "%LOCAL%\src\pages\Scholarships.jsx"           %VM%:%REMOTE%/src/pages/Scholarships.jsx
scp "%LOCAL%\src\pages\GovtJobs.jsx"               %VM%:%REMOTE%/src/pages/GovtJobs.jsx
scp "%LOCAL%\src\pages\Internships.jsx"            %VM%:%REMOTE%/src/pages/Internships.jsx
scp "%LOCAL%\src\data\colleges.js"                 %VM%:%REMOTE%/src/data/colleges.js
scp "%LOCAL%\src\data\entranceExams.js"            %VM%:%REMOTE%/src/data/entranceExams.js
scp "%LOCAL%\src\data\careerPaths.js"              %VM%:%REMOTE%/src/data/careerPaths.js
scp "%LOCAL%\src\data\scholarships.js"             %VM%:%REMOTE%/src/data/scholarships.js
scp "%LOCAL%\src\data\internships.js"              %VM%:%REMOTE%/src/data/internships.js
scp "%LOCAL%\src\data\govtJobs_index.js"           %VM%:%REMOTE%/src/data/govtJobs_index.js
scp "%LOCAL%\src\data\govtJobs_central.js"         %VM%:%REMOTE%/src/data/govtJobs_central.js
scp "%LOCAL%\src\data\govtJobs_ap.js"              %VM%:%REMOTE%/src/data/govtJobs_ap.js
scp "%LOCAL%\src\data\govtJobs_ts.js"              %VM%:%REMOTE%/src/data/govtJobs_ts.js
scp "%LOCAL%\src\data\govtJobs_tn.js"              %VM%:%REMOTE%/src/data/govtJobs_tn.js
scp "%LOCAL%\src\data\govtJobs_ka.js"              %VM%:%REMOTE%/src/data/govtJobs_ka.js
scp "%LOCAL%\src\data\govtJobs_mh.js"              %VM%:%REMOTE%/src/data/govtJobs_mh.js
scp "%LOCAL%\src\data\govtJobs_up.js"              %VM%:%REMOTE%/src/data/govtJobs_up.js
scp "%LOCAL%\src\data\govtJobs_rj.js"              %VM%:%REMOTE%/src/data/govtJobs_rj.js
scp "%LOCAL%\src\data\govtJobs_gj.js"              %VM%:%REMOTE%/src/data/govtJobs_gj.js
scp "%LOCAL%\src\data\govtJobs_wb.js"              %VM%:%REMOTE%/src/data/govtJobs_wb.js
scp "%LOCAL%\src\data\govtJobs_br_jh_or.js"       %VM%:%REMOTE%/src/data/govtJobs_br_jh_or.js
scp "%LOCAL%\src\data\govtJobs_mp_cg.js"           %VM%:%REMOTE%/src/data/govtJobs_mp_cg.js
scp "%LOCAL%\src\data\govtJobs_kl_ga.js"           %VM%:%REMOTE%/src/data/govtJobs_kl_ga.js
scp "%LOCAL%\src\data\govtJobs_dl_uk_jk.js"        %VM%:%REMOTE%/src/data/govtJobs_dl_uk_jk.js
scp "%LOCAL%\src\data\govtJobs_ph_hr_hp.js"        %VM%:%REMOTE%/src/data/govtJobs_ph_hr_hp.js
scp "%LOCAL%\src\data\govtJobs_northeast.js"       %VM%:%REMOTE%/src/data/govtJobs_northeast.js

if %ERRORLEVEL% neq 0 (
    echo [ERROR] SCP failed. Aborting.
    exit /b 1
)

echo [2/2] Building and restarting Docker container on VM...

ssh root@10.127.248.85 "cd /opt/edu-guide/frontend && docker build -t edu-guide . && docker stop edu-guide && docker rm edu-guide && docker run -d --name edu-guide -p 1206:80 edu-guide"

if %ERRORLEVEL% neq 0 (
    echo [ERROR] Remote build/restart failed.
    exit /b 1
)

echo.
echo Deploy complete! Site: http://10.127.248.85:1206
