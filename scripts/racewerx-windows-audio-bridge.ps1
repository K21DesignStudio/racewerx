param(
  [string]$PodId = $env:RACEWERX_POD_ID,
  [string]$PortalUrl = $env:RACEWERX_PORTAL_URL,
  [string]$AgentSecret = $env:RACEWERX_AGENT_SECRET,
  [int]$IntervalMs = 1000,
  [switch]$Once
)

if ([string]::IsNullOrWhiteSpace($PodId)) {
  $PodId = "pod-3"
}

if ([string]::IsNullOrWhiteSpace($PortalUrl)) {
  $PortalUrl = "https://racewerx.vercel.app"
}

if ([string]::IsNullOrWhiteSpace($AgentSecret)) {
  $AgentSecret = "pod-agent-secret-001"
}

$PortalUrl = $PortalUrl.TrimEnd("/")
$PodId = $PodId.Trim()
$LogDir = Join-Path $PSScriptRoot "..\logs"
$LogPath = Join-Path $LogDir ("racewerx-audio-bridge-{0}.log" -f ($PodId -replace "[^a-zA-Z0-9_-]", "-"))

New-Item -ItemType Directory -Force -Path $LogDir | Out-Null

function Write-BridgeLog {
  param([string]$Message)
  $line = "{0} {1}" -f (Get-Date -Format "yyyy-MM-dd HH:mm:ss"), $Message
  Add-Content -LiteralPath $LogPath -Value $line
  Write-Host $line
}

function Add-AudioEndpointType {
  if ("Racewerx.AudioEndpoint" -as [type]) {
    return
  }

  $source = @'
using System;
using System.Runtime.InteropServices;

namespace Racewerx {
  [ComImport, Guid("BCDE0395-E52F-467C-8E3D-C4579291692E")]
  class MMDeviceEnumerator {}

  enum EDataFlow {
    eRender,
    eCapture,
    eAll
  }

  enum ERole {
    eConsole,
    eMultimedia,
    eCommunications
  }

  [Guid("A95664D2-9614-4F35-A746-DE8DB63617E6"), InterfaceType(ComInterfaceType.InterfaceIsIUnknown)]
  interface IMMDeviceEnumerator {
    int NotImpl1();
    [PreserveSig]
    int GetDefaultAudioEndpoint(EDataFlow dataFlow, ERole role, out IMMDevice ppDevice);
  }

  [Guid("D666063F-1587-4E43-81F1-B948E807363F"), InterfaceType(ComInterfaceType.InterfaceIsIUnknown)]
  interface IMMDevice {
    [PreserveSig]
    int Activate(ref Guid iid, int dwClsCtx, IntPtr pActivationParams, out IAudioEndpointVolume ppInterface);
  }

  [Guid("5CDF2C82-841E-4546-9722-0CF74078229A"), InterfaceType(ComInterfaceType.InterfaceIsIUnknown)]
  interface IAudioEndpointVolume {
    int RegisterControlChangeNotify(IntPtr pNotify);
    int UnregisterControlChangeNotify(IntPtr pNotify);
    int GetChannelCount(out uint pnChannelCount);
    int SetMasterVolumeLevel(float fLevelDB, Guid pguidEventContext);
    int SetMasterVolumeLevelScalar(float fLevel, Guid pguidEventContext);
    int GetMasterVolumeLevel(out float pfLevelDB);
    int GetMasterVolumeLevelScalar(out float pfLevel);
    int SetChannelVolumeLevel(uint nChannel, float fLevelDB, Guid pguidEventContext);
    int SetChannelVolumeLevelScalar(uint nChannel, float fLevel, Guid pguidEventContext);
    int GetChannelVolumeLevel(uint nChannel, out float pfLevelDB);
    int GetChannelVolumeLevelScalar(uint nChannel, out float pfLevel);
    int SetMute([MarshalAs(UnmanagedType.Bool)] bool bMute, Guid pguidEventContext);
    int GetMute(out bool pbMute);
    int GetVolumeStepInfo(out uint pnStep, out uint pnStepCount);
    int VolumeStepUp(Guid pguidEventContext);
    int VolumeStepDown(Guid pguidEventContext);
    int QueryHardwareSupport(out uint pdwHardwareSupportMask);
    int GetVolumeRange(out float pflVolumeMindB, out float pflVolumeMaxdB, out float pflVolumeIncrementdB);
  }

  public static class AudioEndpoint {
    static IAudioEndpointVolume Endpoint() {
      var enumerator = (IMMDeviceEnumerator)(new MMDeviceEnumerator());
      IMMDevice device;
      Marshal.ThrowExceptionForHR(enumerator.GetDefaultAudioEndpoint(EDataFlow.eRender, ERole.eMultimedia, out device));

      Guid iid = typeof(IAudioEndpointVolume).GUID;
      IAudioEndpointVolume endpoint;
      Marshal.ThrowExceptionForHR(device.Activate(ref iid, 23, IntPtr.Zero, out endpoint));
      return endpoint;
    }

    public static bool GetMute() {
      bool muted;
      Marshal.ThrowExceptionForHR(Endpoint().GetMute(out muted));
      return muted;
    }

    public static void SetMute(bool muted) {
      Marshal.ThrowExceptionForHR(Endpoint().SetMute(muted, Guid.Empty));
    }

    public static int GetVolumePercent() {
      float volume;
      Marshal.ThrowExceptionForHR(Endpoint().GetMasterVolumeLevelScalar(out volume));
      return (int)Math.Round(Math.Max(0, Math.Min(1, volume)) * 100);
    }

    public static void SetVolumePercent(int percent) {
      float volume = Math.Max(0, Math.Min(100, percent)) / 100f;
      Marshal.ThrowExceptionForHR(Endpoint().SetMasterVolumeLevelScalar(volume, Guid.Empty));
    }
  }
}
'@

  Add-Type -TypeDefinition $source
}

function Get-AudioSnapshot {
  Add-AudioEndpointType

  return [pscustomobject]@{
    volumeLevel = [Racewerx.AudioEndpoint]::GetVolumePercent()
    volumeMuted = [Racewerx.AudioEndpoint]::GetMute()
  }
}

function Test-JsonProperty {
  param(
    [object]$Object,
    [string]$Name
  )

  return $null -ne $Object -and $null -ne $Object.PSObject.Properties[$Name]
}

function Invoke-Poll {
  param(
    [int]$AckCommandId = 0,
    [string[]]$Log = @()
  )

  $audio = Get-AudioSnapshot
  $body = @{
    podId = $PodId
    podName = $PodId.Replace("pod-", "POD ").ToUpper()
    state = "UNLOCKED"
    detail = "Windows audio bridge online"
    countdown = "Audio bridge"
    version = "7.1.0"
    agentVersion = "7.1.0"
    updateStatus = "current"
    volumeLevel = $audio.volumeLevel
    volumeMuted = $audio.volumeMuted
    ackCommandId = $AckCommandId
    log = $Log
  }

  $json = $body | ConvertTo-Json -Depth 6

  return Invoke-RestMethod `
    -Uri "$PortalUrl/api/agent/poll" `
    -Method Post `
    -ContentType "application/json" `
    -Headers @{ "x-agent-key" = $AgentSecret } `
    -Body $json `
    -TimeoutSec 10
}

function Invoke-VolumeCommand {
  param([object]$Volume)

  Add-AudioEndpointType

  if (Test-JsonProperty -Object $Volume -Name "level") {
    [Racewerx.AudioEndpoint]::SetVolumePercent([int]$Volume.level)
  }

  if (Test-JsonProperty -Object $Volume -Name "muted") {
    [Racewerx.AudioEndpoint]::SetMute([bool]$Volume.muted)
  }
}

Write-BridgeLog "starting bridge pod=$PodId portal=$PortalUrl intervalMs=$IntervalMs"

$lastAckCommandId = 0

while ($true) {
  try {
    $response = Invoke-Poll -AckCommandId $lastAckCommandId

    if ($response.command -eq "volume" -and [int]$response.commandId -gt 0) {
      Invoke-VolumeCommand -Volume $response.volume
      $lastAckCommandId = [int]$response.commandId

      $snapshot = Get-AudioSnapshot
      Write-BridgeLog ("applied commandId={0} muted={1} volume={2}" -f $lastAckCommandId, $snapshot.volumeMuted, $snapshot.volumeLevel)
      Invoke-Poll -AckCommandId $lastAckCommandId -Log @("Applied volume command $lastAckCommandId") | Out-Null
    }

    if ($Once) {
      break
    }
  } catch {
    Write-BridgeLog ("error " + $_.Exception.Message)

    if ($Once) {
      throw
    }
  }

  Start-Sleep -Milliseconds $IntervalMs
}
