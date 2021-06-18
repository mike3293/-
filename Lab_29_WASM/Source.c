#include <emscripten/emscripten.h>
#include <stdio.h>
int EMSCRIPTEN_KEEPALIVE sum(int a, int b)
{
   return a + b;
}

int EMSCRIPTEN_KEEPALIVE sub(int a, int b)
{
   return a - b;
}

int EMSCRIPTEN_KEEPALIVE mul(int a, int b)
{
   return a * b;
}