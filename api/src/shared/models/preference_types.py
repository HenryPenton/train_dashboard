from enum import Enum


class AccessibilityPreference(str, Enum):
    NoRequirements = "NoRequirements"
    NoSolidStairs = "NoSolidStairs"
    NoEscalators = "NoEscalators"
    NoElevators = "NoElevators"
    StepFreeToVehicle = "StepFreeToVehicle"
    StepFreeToPlatform = "StepFreeToPlatform"


class JourneyPreference(str, Enum):
    LeastInterchange = "LeastInterchange"
    LeastTime = "LeastTime"
    LeastWalking = "LeastWalking"
