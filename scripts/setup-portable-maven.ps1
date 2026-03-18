# setup-portable-maven.ps1
# Ce script télécharge une version portable de Maven dans le dossier du projet.

$ProjectRoot = Resolve-Path "$PSScriptRoot\.."
$MavenInstallDir = Join-Path $ProjectRoot ".maven"
$MavenZip = Join-Path $ProjectRoot "maven-bin.zip"
$MavenUrl = "https://archive.apache.org/dist/maven/maven-3/3.9.6/binaries/apache-maven-3.9.6-bin.zip"

if (-not (Test-Path $MavenInstallDir)) {
    Write-Host "📥 Téléchargement de Maven portable (3.9.6)..." -ForegroundColor Cyan
    try {
        Invoke-WebRequest -Uri $MavenUrl -OutFile $MavenZip
        Write-Host "📦 Extraction..." -ForegroundColor Cyan
        Expand-Archive -Path $MavenZip -DestinationPath $MavenInstallDir
        Remove-Item $MavenZip
        
        # Trouver le dossier bin
        $BinPath = Get-ChildItem -Path $MavenInstallDir -Filter "mvn.cmd" -Recurse | Select-Object -First 1 -ExpandProperty DirectoryName
        Write-Host "✅ Maven a été installé localement dans : $BinPath" -ForegroundColor Green
    } catch {
        Write-Host "❌ Erreur lors du téléchargement : $($_.Exception.Message)" -ForegroundColor Red
        exit 1
    }
} else {
    Write-Host "ℹ️ Maven portable est déjà présent dans $MavenInstallDir" -ForegroundColor Yellow
}
