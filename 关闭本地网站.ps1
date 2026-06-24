# Free common localhost ports used by Python "python -m http.server".
$ports = @(8000, 8765, 18080, 28123, 58123)

foreach ($port in $ports) {
    $conns = Get-NetTCPConnection -State Listen -LocalAddress "127.0.0.1" -LocalPort $port -ErrorAction SilentlyContinue
    foreach ($c in $conns) {
        try {
            $proc = Get-Process -Id $c.OwningProcess -ErrorAction Stop
            if ($proc.ProcessName -match "^python") {
                Stop-Process -Id $proc.Id -Force
                Write-Host ("Stopped PID {0} (python.exe) listening on port {1}" -f $proc.Id, $port)
            }
        }
        catch {
            # ignore
        }
    }
}

Write-Host "Sweep finished."
Write-Host "If nothing was printed, no Python http.server was listening on those ports."
