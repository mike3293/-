//........................................................................
#include "Winsock2.h" // заголовок WS2_32.dll
#pragma comment(lib, "WS2_32.lib") // экспорт WS2_32.dll
//........................................................................
#include <time.h>
#include <iostream>
#include <string>
using namespace std;
//........................................................................
#define INADDR_ANY (u_long)0x00000000 //любой адрес +++
#define INADDR_LOOPBACK 0x7f000001 // внутренн€€ петл€ +++
#define INADDR_BROADCAST (u_long)0xffffffff // широковещание +++
//........................................................................
string GetErrorMsgText(int code) {
    string msgText;
    switch (code) {
    case WSAEINTR: msgText = "WSAEINTR"; break;
    case WSAEACCES: msgText = "WSAEACCES"; break;
    case WSAEFAULT: msgText = "WSAEFAULT"; break;
    case WSAEINVAL: msgText = "WSAEINVAL"; break;
    case WSAEMFILE: msgText = "WSAEMFILE "; break;
    case WSAEWOULDBLOCK: msgText = "WSAEWOULDBLOCK"; break;
    case WSAEINPROGRESS: msgText = "WSAEINPROGRESS"; break;
    case WSAEALREADY: msgText = "WSAEALREADY"; break;
    case WSAENOTSOCK: msgText = "WSAENOTSOCK"; break;
    case WSAEDESTADDRREQ: msgText = "WSAEDESTADDRREQ"; break;
    case WSAEMSGSIZE: msgText = "WSAEMSGSIZE "; break;
    case WSAEPROTOTYPE: msgText = "WSAEPROTOTYPE"; break;
    case WSAENOPROTOOPT: msgText = "WSAENOPROTOOPT"; break;
    case WSAEPROTONOSUPPORT: msgText = "WSAEPROTONOSUPPORT "; break;
    case WSAESOCKTNOSUPPORT: msgText = "WSAESOCKTNOSUPPORT"; break;
    case WSAEOPNOTSUPP: msgText = "WSAEOPNOTSUPP"; break;
    case WSAEPFNOSUPPORT: msgText = "WSAEPFNOSUPPORT"; break;
    case WSAEAFNOSUPPORT: msgText = "WSAEAFNOSUPPORT"; break;
    case WSAEADDRINUSE: msgText = "WSAEADDRINUSE"; break;
    case WSAEADDRNOTAVAIL: msgText = "WSAEADDRNOTAVAIL"; break;
    case WSAENETDOWN: msgText = "WSAENETDOWN "; break;
    case WSAENETUNREACH: msgText = "WSAENETUNREACH"; break;
    case WSAENETRESET: msgText = "WSAENETRESET "; break;
    case WSAECONNABORTED: msgText = "WSAECONNABORTED"; break;
    case WSAECONNRESET: msgText = "WSAECONNRESET"; break;
    case WSAENOBUFS: msgText = "WSAENOBUFS "; break;
    case WSAEISCONN: msgText = "WSAEISCONN"; break;
    case WSAENOTCONN: msgText = "WSAENOTCONN "; break;
    case WSAESHUTDOWN: msgText = "WSAESHUTDOWN"; break;
    case WSAETIMEDOUT: msgText = "WSAETIMEDOUT "; break;
    case WSAECONNREFUSED: msgText = "WSAECONNREFUSED"; break;
    case WSAEHOSTDOWN: msgText = "WSAEHOSTDOWN "; break;
    case WSAEHOSTUNREACH: msgText = "WSAEHOSTUNREACH "; break;
    case WSAEPROCLIM: msgText = "WSAEPROCLIM"; break;
    case WSASYSNOTREADY: msgText = "WSASYSNOTREADY  "; break;
    case WSAVERNOTSUPPORTED: msgText = "WSAVERNOTSUPPORTED"; break;
    case WSANOTINITIALISED: msgText = "WSANOTINITIALISED "; break;
    case WSAEDISCON: msgText = "WSAEDISCON"; break;
    case WSATYPE_NOT_FOUND: msgText = "WSATYPE_NOT_FOUND "; break;
    case WSAHOST_NOT_FOUND: msgText = "WSAHOST_NOT_FOUND"; break;
    case WSATRY_AGAIN: msgText = "WSATRY_AGAIN"; break;
    case WSANO_RECOVERY: msgText = "WSANO_RECOVERY "; break;
    case WSANO_DATA: msgText = "WSANO_DATA"; break;
    case WSA_INVALID_HANDLE: msgText = "WSA_INVALID_HANDLE "; break;
    case WSA_INVALID_PARAMETER: msgText = "WSA_INVALID_PARAMETER"; break;
    case WSA_IO_INCOMPLETE: msgText = "WSA_IO_INCOMPLETE "; break;
    case WSA_IO_PENDING: msgText = "WSA_IO_PENDING"; break;
    case WSA_NOT_ENOUGH_MEMORY: msgText = "WSA_NOT_ENOUGH_MEMORY"; break;
    case WSA_OPERATION_ABORTED: msgText = "WSA_OPERATION_ABORTED "; break;
        //трЄх ошибок нету


    case WSASYSCALLFAILURE: msgText = "WSASYSCALLFAILURE"; break;
    default: msgText = "***ERROR***"; break;
        return msgText;
    };
};

string SetErrorMsgText(string msgText, int code) {
    return msgText + GetErrorMsgText(code);
}
//........................................................................

int main()
{
    setlocale(LC_ALL, "Russian");
    SOCKADDR_IN clnt; // параметры сокета клиента
    SOCKADDR_IN serv; // параметры сокета sS
    SOCKET sS;
    WSADATA wsaData;
    SOCKET cS; // сокет дл€ обмена данными с клиентом
    try {
        if (WSAStartup(MAKEWORD(2, 0), &wsaData) != 0) {
            throw SetErrorMsgText("Startup:", WSAGetLastError());
        }



        if ((sS = socket(AF_INET, SOCK_DGRAM, NULL)) == INVALID_SOCKET)
            throw SetErrorMsgText("socket:", WSAGetLastError());


        serv.sin_family = AF_INET; // используетс€ IP-адресаци€
        serv.sin_port = htons(4000); // порт 4000
        serv.sin_addr.s_addr = INADDR_ANY; // любой собственный IP-адрес
        if (bind(sS, (LPSOCKADDR)&serv, sizeof(serv)) == SOCKET_ERROR)
            throw SetErrorMsgText("bind:", WSAGetLastError());


        memset(&clnt, 0, sizeof(clnt));
        int lc = sizeof(clnt);
        char ibuf[50];
        int lb = 10;
        while (true) {
            Sleep(20);
            if (lb = recvfrom(sS, ibuf, sizeof(ibuf), NULL, (sockaddr*)&clnt, &lc) == SOCKET_ERROR)
                throw SetErrorMsgText("recv:", WSAGetLastError());
            lb = strlen(ibuf) + 1;
            printf("Client: Receiver IP(s) used: %s\n", inet_ntoa(clnt.sin_addr));
            printf("Client: Receiver port used: %d\n", htons(clnt.sin_port));
            int lobuf = 0;
            cout << "ѕрин€то->" << ibuf << endl;
            //if ((lobuf = sendto(sS, ibuf, strlen(ibuf) + 1, NULL, (sockaddr*)&clnt, sizeof(clnt))) == SOCKET_ERROR)
            //    throw SetErrorMsgText("recv:", WSAGetLastError());
            do {
                strcpy(ibuf, " ");
                lobuf = 0;
                Sleep(20);
                if (lb = recvfrom(sS, ibuf, sizeof(ibuf), NULL, (sockaddr*)&clnt, &lc) == SOCKET_ERROR)
                    throw SetErrorMsgText("recv:", WSAGetLastError());
                lb = strlen(ibuf) + 1;
                if (strcmp(ibuf, " ") == 0) {
                    lb = 0;
                    cout << "END." << endl;
                }
                else {
                    //if ((lobuf = sendto(sS, ibuf, strlen(ibuf) + 1, NULL, (sockaddr*)&clnt, sizeof(clnt))) == SOCKET_ERROR)
                    //    throw SetErrorMsgText("recv:", WSAGetLastError());
                    cout << "ѕрин€то->" << ibuf << endl;
                }

            } while (lb > 0);
        }


        if (closesocket(sS) == SOCKET_ERROR)
            throw SetErrorMsgText("closesocket:", WSAGetLastError());
        if (WSACleanup() == SOCKET_ERROR) {
            throw SetErrorMsgText("Cleanup:", WSAGetLastError());
        }

    }
    catch (string errorMsgText) {
        cout << endl << errorMsgText;
    }
    system("pause");
    return 0;
}


