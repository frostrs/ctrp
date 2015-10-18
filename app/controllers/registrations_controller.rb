class RegistrationsController < Devise::RegistrationsController

  def create
    build_resource(sign_up_params)
    respond_to do |format|
      if resource.save
        format.json { render :status => 200,
                             :json => { :success => true,
                                        :info => "Logged out"
                             } }
      else
        Rails.logger.debug resource.errors.full_messages
        format.json { render json: resource.errors, status: :unprocessable_entity }
      end
    end

  end

  # Build a devise resource passing in the session. Useful to move
  # temporary session data to the newly created user.
  def build_resource(hash=nil)
    self.resource = resource_class.new_with_session(hash || {}, session)
  end

  protected
  #def after_sign_up_path_for(resource)
 #   after_signup_path(:add_user_details)
 # end

  #def after_sign_up_path_for(resource)
   # Rails.logger.info "In after_sign_up_path_for"
   # redirect_to users_path
  #end
end
