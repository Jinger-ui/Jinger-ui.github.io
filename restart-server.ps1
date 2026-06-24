param(
  [int]$Port = 18080
)

$here = Split-Path -Parent $MyInvocation.MyCommand.Path

Get-NetTCPConnection -State Listen -LocalAddress "127.0.0.1" -LocalPort $Port -ErrorAction SilentlyContinue | ForEach-Object {
  try {
    $proc = Get-Process -Id $_.OwningProcess -ErrorAction Stop
    if ($proc.ProcessName -match "^python") {
      Stop-Process -Id $proc.Id -Force
      Write-Host ("Stopped python.exe PID {0} on port {1}" -f $proc.Id, $Port)
    }
  }
  catch {
    # ignore
  }
}

Start-Sleep -Milliseconds 800

$py = $null
foreach ($name in @("python", "py")) {
  try {
    $cmd = Get-Command $name -ErrorAction Stop
    $py = $cmd.Source
    break
  }
  catch {}
}

if (-not $py) {
  Write-Host "ERROR: python/py not found in PATH."
  Write-Host 'Tip: Install Python or add it to PATH, or double-click index.html offline.'
  exit 1
}

$argList = '/k cd /d "' + $here + '" && "' + $py + '" -m http.server --bind 127.0.0.1 ' + $Port
Start-Process -FilePath "cmd.exe" -ArgumentList $argList -WorkingDirectory $here | Out-Null

Start-Sleep -Seconds 2
try {
  Start-Process ("http://127.0.0.1:{0}/" -f $Port) | Out-Null
}
catch {}

Write-Host ("Browser opened (or copy URL): http://127.0.0.1:{0}/" -f $Port)
Write-Host "Close the black CMD window labeled with the resume title to stop the server."
