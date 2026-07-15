# Local preview server for the three GHL page fragments.
# Run:  powershell -ExecutionPolicy Bypass -File .\serve.ps1
# Then: http://localhost:8934/  (also /privacy-policy and /terms)
$root = Split-Path -Parent $MyInvocation.MyCommand.Path
$port = 8934
$listener = New-Object System.Net.HttpListener
$listener.Prefixes.Add("http://localhost:$port/")
$listener.Start()
while ($listener.IsListening) {
    $ctx = $listener.GetContext()
    $path = $ctx.Request.Url.LocalPath.TrimStart('/')
    if ([string]::IsNullOrWhiteSpace($path)) { $path = "index.html" }
    if ($path -notmatch '\.') { $path = "$path.html" }
    $file = Join-Path $root $path
    if (Test-Path $file -PathType Leaf) {
        $bytes = [System.IO.File]::ReadAllBytes($file)
        $ctx.Response.ContentType = "text/html; charset=utf-8"
        $ctx.Response.OutputStream.Write($bytes, 0, $bytes.Length)
    } else {
        $ctx.Response.StatusCode = 404
    }
    $ctx.Response.OutputStream.Close()
}
