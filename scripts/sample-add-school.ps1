# POST a sample school — works in PowerShell without curl quoting issues.
# Usage:  .\scripts\sample-add-school.ps1
# Server must be running: npm start

$uri = "http://localhost:3000/addSchool"
$body = '{"name":"Test High","address":"1 Main St","latitude":40.7,"longitude":-74.0}'

try {
  $response = Invoke-RestMethod -Method Post -Uri $uri -ContentType "application/json; charset=utf-8" -Body $body
  $response | ConvertTo-Json -Depth 5
} catch {
  Write-Host "Request failed. Is the API running on port 3000? Is MySQL up and sql/schema.sql applied?" -ForegroundColor Yellow
  if ($_.ErrorDetails.Message) {
    Write-Host $_.ErrorDetails.Message
  } else {
    Write-Host $_
  }
  exit 1
}
