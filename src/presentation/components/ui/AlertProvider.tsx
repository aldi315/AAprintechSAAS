'use client'

import React, { createContext, useContext, useState, ReactNode } from 'react'
import { AlertModal, AlertType } from './AlertModal'

interface AlertContextType {
  showAlert: (title: string, message: string, type?: AlertType, onConfirm?: () => void) => void
}

const AlertContext = createContext<AlertContextType | undefined>(undefined)

export function AlertProvider({ children }: { children: ReactNode }) {
  const [alertConfig, setAlertConfig] = useState<{
    isOpen: boolean
    title: string
    message: string
    type: AlertType
    onConfirm?: () => void
  }>({
    isOpen: false,
    title: '',
    message: '',
    type: 'info'
  })

  const showAlert = (title: string, message: string, type: AlertType = 'info', onConfirm?: () => void) => {
    setAlertConfig({ isOpen: true, title, message, type, onConfirm })
  }

  const closeAlert = () => {
    setAlertConfig(prev => ({ ...prev, isOpen: false }))
  }

  return (
    <AlertContext.Provider value={{ showAlert }}>
      {children}
      <AlertModal
        isOpen={alertConfig.isOpen}
        onClose={closeAlert}
        onConfirm={() => {
          if (alertConfig.onConfirm) alertConfig.onConfirm()
          closeAlert()
        }}
        title={alertConfig.title}
        message={alertConfig.message}
        type={alertConfig.type}
        confirmText={alertConfig.type === 'confirm' ? 'Ya, Lanjutkan' : 'Mengerti'}
      />
    </AlertContext.Provider>
  )
}

export function useAlert() {
  const context = useContext(AlertContext)
  if (context === undefined) {
    throw new Error('useAlert must be used within an AlertProvider')
  }
  return context
}
