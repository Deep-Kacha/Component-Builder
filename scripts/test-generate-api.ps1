param(
    [string]$BaseUrl = "http://localhost:3000",
    [string]$Prompt = "a simple blue button labeled Click me",
    [int]$TimeoutSec = 120
)

$body = @{ prompt = $Prompt } | ConvertTo-Json -Compress

Write-Host "POST $BaseUrl/api/generate"
Write-Host "Timeout: ${TimeoutSec}s (generation usually takes 25-35s)"
Write-Host ""

$sw = [System.Diagnostics.Stopwatch]::StartNew()

try {
    # Use Invoke-RestMethod — Invoke-WebRequest hangs on Windows for long API responses.
    $json = Invoke-RestMethod `
        -Uri "$BaseUrl/api/generate" `
        -Method POST `
        -ContentType "application/json" `
        -Body $body `
        -TimeoutSec $TimeoutSec

    $sw.Stop()

    Write-Host "Status:  200 ($([math]::Round($sw.Elapsed.TotalSeconds, 1))s)"

    if ($json.code) {
        $preview = $json.code.Substring(0, [Math]::Min(200, $json.code.Length))
        Write-Host "Code:    yes ($($json.code.Length) chars)"
        Write-Host "Preview: $preview"
    }
    elseif ($json.error) {
        Write-Host "Error:   $($json.error)"
        exit 1
    }
    else {
        Write-Host "Response: $($json | ConvertTo-Json -Compress | ForEach-Object { $_.Substring(0, [Math]::Min(500, $_.Length)) })"
        exit 1
    }
}
catch {
    $sw.Stop()
    Write-Host "Failed after $([math]::Round($sw.Elapsed.TotalSeconds, 1))s: $($_.Exception.Message)"

    if ($_.Exception.Message -match "timed out|timeout") {
        Write-Host ""
        Write-Host "Tip: Increase -TimeoutSec to at least 120. Cloud generation takes ~25-35s."
    }

    exit 1
}
