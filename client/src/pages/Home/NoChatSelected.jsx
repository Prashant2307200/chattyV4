import Logo from "../../components/ui/AppLogo"

const NoChatSelected = () => (
    <div className="w-full h-full flex flex-col items-center justify-center p-4 sm:p-8 md:p-16 bg-base-100/50">
      <div className="max-w-md text-center space-y-6 -mt-16">
        {/* Icon Display */}
        <div className="flex justify-center mb-6">
          <div className="relative">
            <div className="w-20 h-20 rounded-2xl bg-primary/10 flex items-center justify-center animate-bounce">
              <Logo className="w-10 h-10 text-primary" />
            </div>
          </div>
        </div>

        {/* Welcome Text */}
        <h2 className="text-2xl font-bold mb-2">Welcome to Chatty!</h2>
        <p className="text-base-content/60 text-sm sm:text-base">
          Select a conversation from the sidebar to start chatting or find new users to connect with.
        </p>
      </div>
    </div>
  )

export default NoChatSelected;