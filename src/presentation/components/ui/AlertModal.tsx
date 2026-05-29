'use client'

import { Fragment } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import { AlertCircle, CheckCircle2, Info, X } from 'lucide-react'

export type AlertType = 'success' | 'error' | 'info' | 'confirm'

interface AlertModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirm?: () => void
  title: string
  message: string
  type?: AlertType
  confirmText?: string
  cancelText?: string
}

export function AlertModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  type = 'info',
  confirmText = 'OK',
  cancelText = 'Batal'
}: AlertModalProps) {
  const isConfirm = type === 'confirm'

  const icons = {
    success: <CheckCircle2 className="w-6 h-6 text-green-500" />,
    error: <AlertCircle className="w-6 h-6 text-red-500" />,
    info: <Info className="w-6 h-6 text-blue-500" />,
    confirm: <AlertCircle className="w-6 h-6 text-orange-500" />
  }

  const bgColors = {
    success: 'bg-green-100',
    error: 'bg-red-100',
    info: 'bg-blue-100',
    confirm: 'bg-orange-100'
  }

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-sm transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                
                <div className="flex gap-4">
                  <div className={`flex shrink-0 items-center justify-center w-12 h-12 rounded-full ${bgColors[type]}`}>
                    {icons[type]}
                  </div>
                  
                  <div className="mt-1">
                    <Dialog.Title
                      as="h3"
                      className="text-lg font-semibold leading-6 text-slate-900"
                    >
                      {title}
                    </Dialog.Title>
                    <div className="mt-2">
                      <p className="text-sm text-slate-500 leading-relaxed">
                        {message}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mt-6 flex justify-end gap-3">
                  {isConfirm && (
                    <button
                      type="button"
                      className="inline-flex justify-center rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 focus:outline-none transition-colors"
                      onClick={onClose}
                    >
                      {cancelText}
                    </button>
                  )}
                  <button
                    type="button"
                    className={`inline-flex justify-center rounded-xl border border-transparent px-4 py-2 text-sm font-medium text-white focus:outline-none transition-colors ${
                      type === 'error' ? 'bg-red-600 hover:bg-red-700' :
                      type === 'confirm' ? 'bg-orange-600 hover:bg-orange-700' :
                      'bg-indigo-600 hover:bg-indigo-700'
                    }`}
                    onClick={() => {
                      if (onConfirm) onConfirm()
                      else onClose()
                    }}
                  >
                    {confirmText}
                  </button>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  )
}
