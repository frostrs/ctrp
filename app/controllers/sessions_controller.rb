class SessionsController < Devise::SessionsController
  skip_before_filter :verify_signed_out_user

  def create

    begin
      # Figure out which type of user we are authenticating.
      # The 'type_if_user' method is implementation specific, and not provided.

      user_class = nil
      error_string = 'Login failed'
      Rails.logger.info "HIHIHI "
      #Rails.logger.info "#{request.inspect}"
      Rails.logger.info "params = #{request.params['user']} "
      Rails.logger.info "user = #{request.params['user']} "
      type = request.params['type']
      Rails.logger.info "request type = #{request.params['type'].inspect} "
      # Copy user data to ldap_user and local_user
      request.params['ldap_user'] = request.params['local_user'] = request.params['user']

      if request.params['type'] == "LocalUser"
        user = User.where(username: request.params['user']["username"]).first
        user_class = :local_user
        Rails.logger.info "user #{user.inspect} "
        raise "Unable to find user with username =#{username}" if user.blank?
        error_string = 'Username or password incorrect'
        Rails.logger.info "Before warden authenticate #{self.resource.inspect}"
        #self.resource = warden.authenticate! scope: user_class
        # For the LocalUser, call the warden authentication in the superclass
        self.resource = warden.authenticate!({ scope: resource_name, recall: "#{controller_path}#new" })
        Rails.logger.info "Result of warden authenticate = #{self.resource.inspect}"
        set_flash_message(:notice, :signed_in) if is_flashing_format?
        sign_in(resource_name, resource)
        yield resource if block_given?
        #respond_with resource, location: after_sign_in_path_for(resource)
        Rails.logger.info "Result of warden authenticate = #{self.resource.inspect}"
        token = create_token({:user_id => user.id})
        Rails.logger.info "Result of warden authenticate JWT token = #{token.inspect}"
        #Rails.logger.info "SESSION = #{self[:user_id].inspect}"
        #Rails.logger.info "current_local_user = #{current_local_user.inspect}"
        #current_user = current_local_user
        ## Rendering JSON back to the browser.
        ## Currently this JSON contains the user_id.
        ## More fields could be added to the JSON, based on what the UI expects
          render json: { token: token }
        #respond_with self.resource, :location => podemo_path
      else
        user_class = :ldap_user
        user = User.where(username: request.params['user']["username"])
        Rails.logger.info "user #{user.inspect} " unless user.blank?
        error_string = 'LDAP details incorrect'
        # Use Warden to authenticate the user, if we get nil back, it failed.
        Rails.logger.info "Before warden authenticate for LDAP =  #{self.resource.inspect}"
        self.resource = warden.authenticate! scope: user_class
        Rails.logger.info "Result of warden authenticate for LDAP = #{self.resource.inspect}"
        if self.resource.nil?
          #raise "Error in Authentication"
          flash[:error] = error_string
         # return redirect_to new_session_path
          render "/ctrp/sign_in"
          return
        end
        # Now we know the user is authenticated, sign them in to the site with Devise
        # At this point, self.resource is a valid user account.
        Rails.logger.info "#{self.resource.inspect}"
        sign_in(user_class, self.resource)
        #respond_with self.resource, :location => after_sign_in_path_for(self.resource)
        token = create_token({:user_id => self.resource.id})
        Rails.logger.info "Result of warden authenticate JWT token = #{token.inspect}"
        render json: { token: token}
        #respond_with self.resource, :location => podemo_path
     end
    rescue
      Rails.logger.info "HI ABC rescue"
      Rails.logger.info "#{self.resource.inspect}" unless self.resource.nil?
      if self.resource.nil? && type == "LocalUser"
        # The user needs to first Sign Up before logging in
        flash[:error] = error_string
        # return redirect_to new_session_path
        return redirect_to new_local_user_registration_path

      end
        #Rails.logger.error "Error in authentication: " + exception.backtrace.inspect
    ensure
    end

  end

  def destroy
    Rails.logger.info "HI IN DESTROY"
    Rails.logger.info "session = #{session.inspect}"
    Rails.logger.info "params = #{request.params} "


    user = User.find_by_username(request.params["username"])
    Rails.logger.info "user = #{user.inspect} "
        ##User.find_by_id(user_id)User.where(username: request.params['user']["username"])
    sign_in user, :bypass => true
    Rails.logger.info "after sign_in user = #{user.inspect} "
    sign_out(user)
    Rails.logger.info "after sign_out user = #{user.inspect} "
#    token = request.headers['Authorization']
#    unless token.nil?
#      Rails.logger.error ""
#    end
    # Destroy session
    #method(:destroy).super_method.call
    render :status => 200,
           :json => { :success => true,
                      :info => "Logged out",
           }
  end

  def new
    # Set up a blank resource for the view rendering
    #Rails.logger.info "#{self.inspect}"
    self.resource = User.new
  end

  private

  def create_token(token_data)
    secret = "secret" # must be an environment variable
    JWT.encode(token_data, secret)
  end
  #- See more at: http://blog.moove-it.com/token-based-authentication-json-web-tokenjwt/#sthash.QlxioFfO.dpuf
end
