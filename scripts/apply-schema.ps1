# Applies sql/schema.sql using the first mysql.exe found in common Windows locations.
# Run from repo root:  powershell -ExecutionPolicy Bypass -File scripts/apply-schema.ps1
# Requires: MySQL or XAMPP MySQL running; DB name must match .env DB_NAME (default campuscompass).

$ErrorActionPreference = "Stop"

$candidates = @(
    "${env:ProgramFiles}\MySQL\MySQL Server 8.4\bin\mysql.exe",
    "${env:ProgramFiles}\MySQL\MySQL Server 8.0\bin\mysql.exe",
    "${env:ProgramFiles}\MySQL\MySQL Server 5.7\bin\mysql.exe",
    "C:\xampp\mysql\bin\mysql.exe",
    "C:\laragon\bin\mysql\mysql-8.4.3-winx64\bin\mysql.exe"
)

$mysql = $candidates | Where-Object { Test-Path $_ } | Select-Object -First 1

if (-not $mysql) {
    Write-Host "Could not find mysql.exe. Install MySQL Server or XAMPP, or edit scripts/apply-schema.ps1 and add your path." -ForegroundColor Red
    exit 1
}

$schema = Join-Path $PSScriptRoot "..\sql\schema.sql" | Resolve-Path
$dbName = "campuscompass"

Write-Host "Using: $mysql" -ForegroundColor Cyan
Write-Host "Schema: $schema"
Write-Host "Database: $dbName (change DB_NAME in .env if you use another name)"
Write-Host ""

& $mysql -u root -p -e "CREATE DATABASE IF NOT EXISTS $dbName;"
Get-Content $schema | & $mysql -u root -p $dbName

Write-Host ""
Write-Host "Done. If prompted, enter your MySQL root password (XAMPP: often empty, press Enter)." -ForegroundColor Green
