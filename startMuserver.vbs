Dim objShell
Set objShell = WScript.CreateObject("WScript.Shell")
objShell.CurrentDirectory = "C:\WTelePc\React\muserver\dist\"
objShell.Run("""node"" ./server.js"), 0
Set objShell = Nothing
