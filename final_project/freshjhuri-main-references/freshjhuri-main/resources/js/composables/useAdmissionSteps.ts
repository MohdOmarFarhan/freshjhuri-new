import { router } from '@inertiajs/vue3'
import { computed } from 'vue'
import { route } from 'ziggy-js'

export function useAdmissionSteps() {
    const steps = [
        {
            name: 'Basic Info',
            routeName: 'basic-info.create',
        },
        {
            name: 'Admission Info',
            routeName: 'admission-info.create',
        },
        {
            name: 'Subject Info',
            routeName: 'subject-info.create',
        },
        {
            name: 'Result Info',
            routeName: 'result-info.create',
        },
        {
            name: 'Documents',
            routeName: 'asset-info.create',
        },
        {
            name: 'Payment & Confirm',
            routeName: 'payment-info.create',
        },
    ]

    const currentStep = computed(() => {
        const currentRoute = route().current()
        return steps.findIndex(step => step.routeName === currentRoute)
    })

    const navigateToStep = (step: { routeName: any }) => {
        router.get(route(step.routeName))
    }

    const stepsWithStatus = computed(() => {
        const current = currentStep.value
        return steps.map((step, index) => ({
            ...step,
            completed: index < current,
        }))
    })

    return {
        steps: stepsWithStatus,
        currentStep,
        navigateToStep,
    }
}
