$ErrorActionPreference = 'Stop'
if (!(Test-Path 'jdk17')) {
    Write-Host 'Downloading JDK 17...'
    Invoke-WebRequest -Uri 'https://download.java.net/java/GA/jdk17.0.2/dfd4a8d0985749f896bed50d7138ee7f/8/GPL/openjdk-17.0.2_windows-x64_bin.zip' -OutFile 'jdk17.zip'
    Write-Host 'Extracting JDK 17...'
    Add-Type -AssemblyName System.IO.Compression.FileSystem
    [System.IO.Compression.ZipFile]::ExtractToDirectory('jdk17.zip', 'jdk17')
    Remove-Item 'jdk17.zip'
}
$env:JAVA_HOME = "$PWD\jdk17\jdk-17.0.2"
$env:PATH = "$env:JAVA_HOME\bin;" + $env:PATH
Write-Host 'Running Spring Boot with JDK 17...'
.\maven_home\apache-maven-3.9.6\bin\mvn.cmd spring-boot:run
