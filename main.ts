#include "pxt.h"
#include "ScratchMoreService.h"

#define NOTIFY_PERIOD 100

enum Slot {
    //% block="slot0"
    SLOT0 = 0,
    //% block="slot1"
    SLOT1 = 1,
    //% block="slot2"
    SLOT2 = 2,
    //% block="slot3"
    SLOT3 = 3,
};

//% color=#FF9900 weight=95 icon="\uf1b0"
namespace ScratchMore {
    ScratchMoreService* _pService = NULL;
    Action _handler;

    void notifyScratch() {
        while (NULL != _pService) {
            // run action that updates Scratch data
            pxt::runAction0(_handler);
            // raise event to trigger notification
            MicroBitEvent ev(SCRATCH_MORE_ID, SCRATCH_MORE_EVT_NOTIFY);
            // wait period
            fiber_sleep(NOTIFY_PERIOD);
        }
    }

    /**
    * Starts a Scratch extension service.
    * The handler can call ``setscratchMoreSlot`` to send any data to Scratch.
    */
    //%
    void startScratchMoreService(Action handler) {
        if (NULL != _pService) return;

        _pService = new ScratchMoreService(uBit);
        _handler = handler;
        pxt::incr(_handler);
        create_fiber(notifyScratch);
    }

    /**
    * Set slot value.
    */
    //%
    void setScratchMoreSlot(Slot slot, int value) {
        if (NULL == _pService) return;

        _pService->setSlot((int)slot, value);
    }

    /**
     * Get slot value. 
     */
    //%
    int getScratchMoreSlot(Slot slot) {
        if (NULL == _pService) return 0;

        return _pService->getSlot((int)slot);
    }    
    
    let slots: number[] = [0, 0, 0, 0];

    /**
    * Starts a Scratch extension service.
    * The handler can call ``setscratchMoreSlot`` to send any data to Scratch.
    */
    //% blockId=scratchmore_startScratchMoreService block="Scratch More service"
    //% shim=ScratchMore::startScratchMoreService
    export function startService(handler: Action):void {
        console.log("Scratch More started");
    }

    //% blockId=scratchmore_setScratchMoreSlot block="Scratch More at %slot put %value"
    //% shim=ScratchMore::setScratchMoreSlot
    export function setSlot(slotIndex: Slot, slotValue: number):void {
        slots[slotIndex] = slotValue;
    }

    /**
     * Get slot value. 
     */
    //% blockId=scratchmore_getScratchMoreSlot block="Scratch More at %slot"
    //% shim=ScratchMore::getScratchMoreSlot
    export function getSlot(slotIndex: Slot):number {
        return slots[slotIndex];
    }
    
    
    
}

  ScratchMore.startScratchMoreService(function () {

})
